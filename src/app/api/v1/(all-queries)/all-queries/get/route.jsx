import { DbConnect } from "@/database/database";
import { handelAsyncErrors } from "@/helpers/asyncErrors";
import { getPaginationParams } from "@/helpers/paginations";
import continentModel from "@/model/continentModel";
import countriesModel from "@/model/countryModel";
import CitiesModel from "@/model/citiesModel";
import PackagesModel from "@/model/packagesModel";
import BlogModel from "@/model/blogModel";
import ActivitiesModel from "@/model/activitiesModel";
import PackageCategoryModel from "@/model/packageCategories";
import FooterModel from "@/model/footerModel";
import { NextResponse } from "next/server";

DbConnect();

export async function GET(req) {
  return handelAsyncErrors(async () => {
    const { page, limit, skip } = getPaginationParams(req);

    
    const [continents, countries, cities, packages, blogs, activities, packageCategories, footer] = await Promise.all([
      continentModel.find()
        .populate({
          path: "all_countries",
          select: "_id images title description slug",
          populate: {
            path: "all_cities",
            select: "_id title all_packages",
            populate: {
              path: "all_packages",
              select: "_id title package_price package_discounted_price",
            },
          },
        })
        .sort({ createdAt: -1 }) 
        .limit(limit)
        .skip(skip)
        .lean()
        .exec(),
      countriesModel.find()
        .populate({
          path: "all_cities",
          select: "_id title all_packages",
          populate: {
            path: "all_packages",
            select: "_id title package_price package_discounted_price",
          },
        })
        .sort({ createdAt: -1 }) 
        .limit(limit)
        .skip(skip)
        .lean()
        .exec(),
      CitiesModel.find()
        .sort({ createdAt: -1 })  
        .limit(limit)
        .skip(skip)
        .lean()
        .exec(),
      PackagesModel.find()
        .sort({ createdAt: -1 }) 
        .limit(limit)
        .skip(skip)
        .populate({
          path: "city_id",
          select: "_id title slug",
          populate: {
            path: "country_id",
            select: "_id title slug",
            populate: {
              path: "continent_id",
              select: "_id title slug",
            },
          },
        })
        .select("_id images title description slug package_price package_discounted_price package_days package_nights")
        .lean()
        .exec(),
      BlogModel.find()
        .populate("blog_category", "_id name slug")
        .sort({ createdAt: -1 })  
        .limit(limit)
        .skip(skip)
        .select("_id images title description slug blog_category blog_overview blog_description createdAt")
        .lean()
        .exec(),
      ActivitiesModel.find()
        .sort({ createdAt: -1 })  
        .limit(limit)
        .skip(skip)
        .select("_id icon images title description slug activity_price activity_discounted_price")
        .lean()
        .exec(),
      PackageCategoryModel.find()
        .sort({ createdAt: -1 })  
        .limit(limit)
        .skip(skip)
        .select("_id image title description slug")
        .lean()
        .exec(),
      FooterModel.find()
        .lean()
        .exec(),
    ]);

   
    const totalCounts = await Promise.all([
      continentModel.countDocuments(),
      countriesModel.countDocuments(),
      CitiesModel.countDocuments(),
      PackagesModel.countDocuments(),
      BlogModel.countDocuments(),
      ActivitiesModel.countDocuments(),
      PackageCategoryModel.countDocuments()
    ]);

    // Format results
    const result = {
      continents: continents.map(continent => ({
        _id: continent._id,
        images: continent.images,
        title: continent.title,
        description: continent.description,
        slug: continent.slug,
        countries: continent.all_countries.map(country => ({
          _id: country._id,
          images: country.images,
          title: country.title,
          description: country.description,
          slug: country.slug,
          cities: country.all_cities.map(city => ({
            _id: city._id,
            city_name: city.title,
            city_packages_count: city.all_packages.length,
          })),
          totalCities: country.all_cities.length,
        })),
        total_countries: continent.all_countries.length,
      })),
      countries: countries.map(country => ({
        _id: country._id,
        images: country.images,
        title: country.title,
        description: country.description,
        slug: country.slug,
        cities: country.all_cities.map(city => ({
          _id: city._id,
          city_name: city.title,
          city_packages_count: city.all_packages.length,
        })),
        totalCities: country.all_cities.length,
      })),
      cities: cities.map(city => ({
        _id: city._id,
        images: city.images,
        title: city.title,
        description: city.description,
        slug: city.slug,
        packagesCount: city.all_packages.length,
      })),
      packages: packages.map(pkg => ({
        _id: pkg._id,
        images: pkg.images,
        title: pkg.title,
        description: pkg.description,
        slug: pkg.slug,
        package_price: pkg.package_price,
        package_discounted_price: pkg.package_discounted_price,
        package_days: pkg.package_days,
        package_nights: pkg.package_nights,
        package_under_continent: pkg.city_id?.country_id?.continent_id
          ? {
              _id: pkg.city_id.country_id.continent_id._id.toString(),
              title: pkg.city_id.country_id.continent_id.title,
              slug: pkg.city_id.country_id.continent_id.slug,
            }
          : null,
        package_under_country: pkg.city_id?.country_id
          ? {
              _id: pkg.city_id.country_id._id.toString(),
              title: pkg.city_id.country_id.title,
              slug: pkg.city_id.country_id.slug,
            }
          : null,
        package_under_city: pkg.city_id
          ? {
              _id: pkg.city_id._id.toString(),
              title: pkg.city_id.title,
              slug: pkg.city_id.slug,
            }
          : null,
      })),
      blogs: blogs.map(blog => ({
        _id: blog._id,
        images: blog.images,
        title: blog.title,
        description: blog.description,
        slug: blog.slug,
        category: blog.blog_category
          ? {
              _id: blog.blog_category._id,
              name: blog.blog_category.name,
              slug: blog.blog_category.slug,
            }
          : null,
        blog_overview: blog.blog_overview,
        blog_description: blog.blog_description,
        createdAt: blog.createdAt,
      })),
      activities: activities.map(activity => {
        const discount =
          activity.activity_price && activity.activity_discounted_price
            ? (
                ((activity.activity_price -
                  activity.activity_discounted_price) /
                  activity.activity_price) *
                100
              ).toFixed(2)
            : "0";
        return {
          _id: activity._id,
          icon: activity.icon,
          images: activity.images,
          title: activity.title,
          description: activity.description,
          slug: activity.slug,
          activity_price: activity.activity_price,
          activity_discounted_price: activity.activity_discounted_price,
          discount,
          city_id: activity.city_id,
        };
      }),
      packageCategories: packageCategories.map(category => ({
        _id: category._id,
        image: category.image,
        title: category.title,
        description: category.description,
        slug: category.slug,
      })),
      footer: footer.length > 0 ? footer[0] : null,
      pagination: {
        page,
        limit,
        totalContinents: totalCounts[0],
        totalCountries: totalCounts[1],
        totalCities: totalCounts[2],
        totalPackages: totalCounts[3],
        totalBlogs: totalCounts[4],
        totalActivities: totalCounts[5],
        totalPackageCategories: totalCounts[6],
      },
    };

    return NextResponse.json({
      status: 200,
      success: true,
      result,
    });
  });
}
